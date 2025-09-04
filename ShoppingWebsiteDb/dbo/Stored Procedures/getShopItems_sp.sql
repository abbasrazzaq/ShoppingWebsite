
CREATE PROCEDURE [dbo].[GetShopItems_sp]
	@PageIndex INT,
	@PageSize INT,
	@Name NVARCHAR(100) = NULL,
	@Categories	dbo.IdList READONLY,
	@FilterByCategories BIT = 0,
	@MaxPrice FLOAT = NULL,
	@MinStock INT = NULL
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @FilteredItems TABLE
	(
		[Id] INT,
		[Name] NVARCHAR(50),
		[Price] FLOAT,
		[Stock] INT,
		[Category] NVARCHAR(100)
	);

	INSERT INTO @FilteredItems
	SELECT		[Id], [Name], [Price], [Stock], [Category]
	FROM		[dbo].[ShopItemTable] AS [SIT]
	WHERE	(@Name IS NULL OR [SIT].[Name] LIKE '%' + @Name + '%')
			AND (@FilterByCategories = 0 OR [SIT].[Category] IN (SELECT Id From @Categories))
			AND (@MaxPrice IS NULL OR [SIT].[Price] <= @MaxPrice)
			AND (@MinStock IS NULL OR [SIT].[Stock] >= @MinStock)


	SELECT COUNT(*) FROM @FilteredItems;

	SELECT *
	FROM @FilteredItems
	ORDER BY [Id]
	OFFSET (@PageIndex * @PageSize) ROWS
	FETCH NEXT @PageSize ROWS ONLY;

END