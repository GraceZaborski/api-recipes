import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

const connections = [];
export const rootMongooseTestModule = (
  connectionName,
  options: MongooseModuleOptions = {},
) => {
  const connection = MongooseModule.forRootAsync({
    connectionName,
    useFactory: async () => {
      return {
        uri: `mongodb://localhost:27017/${connectionName}`,
        ...options,
      };
    },
  });

  connections.push(connection);
  return connection;
};
