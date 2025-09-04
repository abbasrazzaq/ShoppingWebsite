
CREATE PROCEDURE [dbo].[ValidateLogin_sp]
	@username NVARCHAR(50),
	@password NVARCHAR(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT TOP 1 [UT].Id
	FROM UserTable AS [UT]
	WHERE	[UT].Username		= @username
			AND [UT].Password	= @password; 

	--SELECT CASE
	--	WHEN EXISTS (
	--		SELECT	[UT].Id
	--		FROM	UserTable AS [UT]
	--		WHERE	[UT].Username		= @username
	--				AND [UT].Password	= @password
	--		)
	--		THEN CAST(1 AS BIT)
	--		ELSE CAST(0 AS BIT)
	--	END AS IsValid;

END