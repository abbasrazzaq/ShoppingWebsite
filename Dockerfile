# Stage 1: Build the Vite frontend
FROM node:20 AS build-frontend
WORKDIR /src/shoppingwebsite.client

# Install dependencies
COPY shoppingwebsite.client/package*.json ./
RUN npm ci
COPY shoppingwebsite.client/ .
RUN npm run build

# Stage 2: Build & publish the ASP.NET Core backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-backend
WORKDIR /src

# Copy solution & server project files
COPY ShoppingWebsite.Server/ShoppingWebsite.Server.csproj ShoppingWebsite.Server/
RUN dotnet restore ShoppingWebsite.Server/ShoppingWebsite.Server.csproj

# Copy server source
COPY ShoppingWebsite.Server/. ShoppingWebsite.Server/

# Copy the built frontend assets into the server's wwwroot before publish
COPY --from=build-frontend /src/shoppingwebsite.client/dist/ ShoppingWebsite.Server/wwwroot/

# Publish the server
RUN dotnet publish \
		ShoppingWebsite.Server/ShoppingWebsite.Server.csproj \
		-c Release \
		-o /app/publish
		
# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published backend
COPY --from=build-backend /app/publish .

# Launch the ASP.NET Core app
ENTRYPOINT ["dotnet", "ShoppingWebsite.Server.dll", "--urls", "http://0.0.0.0:8080"]
EXPOSE 8080