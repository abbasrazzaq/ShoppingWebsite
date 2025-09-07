
CREATE PROCEDURE [dbo].[GetUserLoginInfo_sp]
	@username NVARCHAR(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT TOP 1 [UT].Id, [UT].[Password]
	FROM UserTable AS [UT]
	WHERE	[UT].Username = @username;

END