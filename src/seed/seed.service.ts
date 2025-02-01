import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { availableMemory } from 'process';


@Injectable()
export class SeedService {
  constructor(
      @InjectModel( Pokemon.name )
        private readonly PokemonModel: Model<Pokemon>,
  ){}
  private readonly axios: AxiosInstance = axios;



  async executeSeed(){

    // await this.PokemonModel.deleteMany({}) //! delete * from pokemons 
    
    const { data } = await this.axios.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    // const insertPromisesArray:any = [];

    //! Se define una variable donde los parametros a recibir son los mismos que estamos recolectando de la api y los guardamos en una array
    const pokemonToInsert: { name:string, no: number}[] = [];

    //recorre los resultados para obtener el numero del pokemon que viene en la url(se separa por segmentos y eso se hace un arrary donde se selecciona la posi -2)
    data.results.forEach(async({name,url})=>{
      const segments = url.split('/')
      const no:number = +segments [segments.length - 2]
      // const pokemon = await this.PokemonModel.create( ({name ,no}) )
      
      //! Con los datos ya alamacenados en la variable que tiene un array hacemos un push de los datos
      pokemonToInsert.push({name ,no})
      // await Promise.all( insertPromisesArray ) 
    })

    // Se insertan a la base de datos 
    await this.PokemonModel.insertMany(pokemonToInsert)


  return 'Seed Executed'
  }
}

