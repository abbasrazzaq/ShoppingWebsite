
CREATE PROCEDURE [dbo].[BuyItems_sp]
	@CartItemList dbo.CartItemList READONLY,
	@BankBalance DECIMAL(18, 2)
AS
BEGIN
	SET NOCOUNT ON;
	SET XACT_ABORT ON;

	BEGIN TRANSACTION;

	BEGIN TRY

		DECLARE @UpdatedItems TABLE (RowTotal Decimal(18, 2));

		UPDATE [SI]
		SET [SI].Stock = ([SI].Stock - [CI].[Count])
		OUTPUT (deleted.Price * CI.[Count]) INTO @UpdatedItems(RowTotal)
		FROM ShopItemTable AS [SI]
		INNER JOIN @CartItemList CI
			ON [CI].Id = [SI].Id
		WHERE [SI].[Stock] >= [CI].[Count]

		IF @@ROWCOUNT < (SELECT COUNT(*) FROM @CartItemList)
			THROW 50000, 'Not enough stock for one or more items.', 1;

		DECLARE @TotalCost INT = 0;
		SELECT @TotalCost = SUM(RowTotal) FROM @UpdatedItems;

		IF @TotalCost > @BankBalance
			THROW 50001, 'Not enough in the bank balance for all items.', 1;

		COMMIT TRANSACTION;

	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;

		THROW;
	END CATCH


END