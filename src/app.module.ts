import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/app.config';
import { JoinValidationSchema } from './config/joi.validation';


@Module({

  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoinValidationSchema,
    }  
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),

    MongooseModule.forRoot(process.env.MONGODB || "mongodb://mongo:hdAtHgETPTFteuDaYsDTHGcjxoQvWMcC@autorack.proxy.rlwy.net:57569", {dbName: 'pokemonsdb'}) ,
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {

  constructor(){
    // console.log ( process.env )
  }
}
