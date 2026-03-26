import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cash for Ads API',
      version: '1.0.0',
      description:
        'API documentation for Cash for Ads - a platform where users watch ads and earn rewards',
      contact: {
        name: 'API Support',
        email: 'support@cashforads.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
      {
        url: 'https://api.cashforads.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            country: {
              type: 'string',
              description: 'User country code',
            },
            emailVerified: {
              type: 'boolean',
              description: 'Whether email is verified',
            },
          },
        },
        Ad: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Ad ID',
            },
            title: {
              type: 'string',
              description: 'Ad title',
            },
            description: {
              type: 'string',
              description: 'Ad description',
            },
            durationSeconds: {
              type: 'integer',
              description: 'Ad duration in seconds',
            },
            rewardAmount: {
              type: 'integer',
              description: 'Reward amount in cents',
            },
            active: {
              type: 'boolean',
              description: 'Whether ad is active',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Detailed error messages',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Ads',
        description: 'Ad management endpoints',
      },
      {
        name: 'KYC',
        description: 'KYC verification endpoints',
      },
      {
        name: 'Admin',
        description: 'Admin-only endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/server.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
