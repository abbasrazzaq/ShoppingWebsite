
CREATE PROCEDURE [dbo].[GetUserBankBalance_sp]
	@UserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT TOP 1 [UT].BankBalance
	FROM [dbo].[UserTable] AS [UT]
	WHERE [UT].[Id] = @userId
END