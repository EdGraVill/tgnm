/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoError } from 'mongodb';
import mongoose, {
  Document,
  Model,
  NativeError,
  Schema,
  SchemaDefinition,
  SchemaOptions,
  Error as Errors,
} from 'mongoose';
import { ExtractMethods, ExtractStatics, InterfaceToSchema, SchemaLayer } from './types';

export const createSchema = (
  schemaDefinition: InterfaceToSchema<SchemaLayer<Record<string, any>>>,
  options?: Omit<SchemaOptions, 'timestamps'>,
  errorMap?: { [code: string]: string },
) => {
  const schema = new Schema(schemaDefinition as SchemaDefinition, {
    timestamps: {
      createdAt: 'timestamps.created',
      updatedAt: 'timestamps.updated',
    },
    ...(options || {}),
  });

  schema.post<Document>(
    /^(save|update.*)$/g,
    function postModify(err: MongoError, doc: Document, next: (err?: NativeError) => void) {
      if (err.name === 'ValidationError') {
        const castedError = (err as unknown) as Errors.ValidationError;

        const naturalLanguageString = Object.values(castedError.errors)
          .map((err) => err.message)
          .join('. ');

        next(new Error(naturalLanguageString));
      } else if (errorMap && errorMap[`${err.code}`]) {
        next(new Error(errorMap[`${err.code}`]));
      } else if (errorMap) {
        for (const messageChunk in errorMap) {
          if (err.message.includes(messageChunk)) {
            next(new Error(errorMap[messageChunk]));
            break;
          }
        }
      } else {
        next(err);
      }
    },
  );

  return schema;
};

const schemas = {};

export const modelGetter = <D extends Document, M extends Model<D>>(modelName: string, schema: Schema) => (): M => {
  if (process.env.NODE_ENV !== 'production') {
    schemas[modelName] = schema;

    // This will help for development & testing process
    delete mongoose.models[modelName];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (mongoose as any).modelSchemas[modelName];

    Object.keys(schemas).forEach((mn) => {
      mongoose.model(mn, schemas[mn]);
    });
  }

  try {
    const Model = mongoose.model(modelName) as M;

    return Model;
  } catch (error) {
    return mongoose.model<D, M>(modelName, schema) as M;
  }
};

export const connectToDB = async (): Promise<void> => {
  const isAlreadyConnected = (global as any).mongoConnection;

  if (isAlreadyConnected) {
    console.info('Connection restored');

    return;
  }

  try {
    const connection = await mongoose.connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    (global as any).mongoConnection = connection;

    console.info('Connected to DB');

    return;
  } catch (error) {
    console.error(error);
  }
};

export function methodsAdditor<S extends SchemaLayer<Record<string, unknown>>, D extends Document>(
  methodsMap: ExtractMethods<S, D>,
) {
  return (schema: Schema) => {
    for (const methodName in methodsMap) {
      schema.methods[methodName] = methodsMap[methodName];
    }
  };
}

export function staticsAdditor<D extends Document, M extends Model<D>>(methodsMap: ExtractStatics<D, M>) {
  return (schema: Schema) => {
    for (const methodName in methodsMap) {
      schema.statics[methodName] = methodsMap[methodName];
    }
  };
}
