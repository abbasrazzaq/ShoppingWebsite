using Dapper;
using System.Data;

namespace ShoppingWebsite.Server
{
    public class WeatherForecastService
    {
        private readonly IDbConnection _db;
        public WeatherForecastService(IDbConnection db) => _db = db;

        public async Task<IEnumerable<WeatherForecast>> GetForecastsAsync()
        {
            return await _db.QueryAsync<WeatherForecast>("GetWeatherForecasts_sp",
                commandType: CommandType.StoredProcedure);
        }
    }
}
