CREATE TABLE [dbo].[WeatherForecasts] (
    [Id]           INT           IDENTITY (1, 1) NOT NULL,
    [Date]         DATETIME      NOT NULL,
    [TemperatureC] INT           NOT NULL,
    [Summary]      NVARCHAR (50) NOT NULL
);

