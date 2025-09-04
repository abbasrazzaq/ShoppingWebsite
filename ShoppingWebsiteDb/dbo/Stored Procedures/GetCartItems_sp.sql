
CREATE PROCEDURE [dbo].[GetCartItems_sp]
	@Ids dbo.IdList READONLY
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    SELECT	[SI].[Id],
			[SI].[Name],
			[SI].[Price]
	FROM [dbo].[ShopItemTable] AS [SI]
	WHERE [SI].Id IN (SELECT * FROM @Ids);
	
END