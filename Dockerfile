# Stage 1: Build the Vite frontend
FROM node:20 AS build-frontend
WORKDIR /src/shoppingwebsite.client

# Install dependencies
COPY shoppingwebsite.client/package*.json ./
RUN npm ci

# Build production assets
COPY shoppingwebsite.client/ .
RUN npm run build

# Stage 2: Build & publish the ASP.NET Core backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-backend
WORKDIR /src

# Copy solution & server project files
COPY ShoppingWebsite.sln .
COPY ShoppingWebsite.Server/ShoppingWebsite.Server.csproj ShoppingWebsite.Server/

# Restore only the server project to leverage layer cache
RUN dotnet restore ShoppingWebsite.Server/ShoppingWebsite.Server.csproj

# Copy everything and publish
COPY . .
RUN dotnet publish \
		ShoppingWebsite.Server/ShoppingWebsite.Server.csproj \
		-c Release \
		-o /app/publish
		
# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published backend
COPY --from=build-backend /app/publish .

# Copy built frontend into wwwroot
COPY --from=build-frontend /src/shoppingwebsite.client/dist ./wwwroot

# Launch the ASP.NET Core app
ENTRYPOINT ["dotnet", "ShoppingWebsite.Server.dll"]