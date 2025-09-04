
CREATE PROCEDURE [dbo].[BuyItems_sp]
	@CartItemList dbo.CartItemList READONLY,
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;
	SET XACT_ABORT ON;

	BEGIN TRANSACTION;

	BEGIN TRY

		DECLARE @BankBalance DECIMAL(18, 2);
		SELECT	@BankBalance = [UT].BankBalance
				FROM [dbo].[UserTable] AS [UT]
				WHERE [UT].[Id] = @userId

		DECLARE @UpdatedItems TABLE (RowTotal Decimal(18, 2));

		-- Decrease the stock and also calculate the total cost
		UPDATE [SI]
		SET [SI].Stock = ([SI].Stock - [CI].[Count])
		OUTPUT (deleted.Price * CI.[Count]) INTO @UpdatedItems(RowTotal)
		FROM ShopItemTable AS [SI]
		INNER JOIN @CartItemList CI
			ON [CI].Id = [SI].Id
		WHERE [SI].[Stock] >= [CI].[Count]

		-- Check that the numbers make sense for stock and for cost vs user's balance
		IF @@ROWCOUNT < (SELECT COUNT(*) FROM @CartItemList)
			THROW 50000, 'Not enough stock for one or more items.', 1;

		DECLARE @TotalCost DECIMAL(18, 2) = 0;
		SELECT @TotalCost = SUM(RowTotal) FROM @UpdatedItems;

		IF @TotalCost > @BankBalance
			THROW 50001, 'Not enough in the bank balance for all items.', 1;

		-- Update user's balance
		UPDATE	[dbo].[UserTable]
		SET		[BankBalance] = (@BankBalance - @TotalCost)
		WHERE	Id = @UserId;

		COMMIT TRANSACTION;

	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;

		THROW;
	END CATCH


END