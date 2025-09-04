CREATE PROCEDURE GetWeatherForecasts_sp
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    
	SELECT TOP 5 
	Id,
	Date,
	TemperatureC,
	Summary
	FROM WeatherForecasts
	ORDER BY Date;

END
