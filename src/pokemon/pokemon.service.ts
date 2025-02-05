import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(

    @InjectModel( Pokemon.name )
    private readonly PokemonModel: Model<Pokemon>,
    private readonly configService : ConfigService,
  ){
    // console.log(process.env.PORT)
    // console.log(configService.get('default_limit'))
  } 

  async create(createPokemonDto: CreatePokemonDto) { 


    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try{
      const pokemon = await this.PokemonModel.create( createPokemonDto )
      return pokemon;
    }catch(error){
      this.handleExeptions(error)
    }
  }

    async findAll(paginationDto: PaginationDto) {
      const defaultLimit = process.env.DEFAULT_LIMIT ? +process.env.DEFAULT_LIMIT : 10;
      const { limit = defaultLimit, offset = 0 } = paginationDto;
      return this.PokemonModel.find() 
      .limit(limit)
      .skip(offset)
      .sort({
        no:1
      })
      .select('-__v')
    
    }
    
  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if (isNaN(+term)) {
      // Si `term` no es un número, buscarlo por nombre
      pokemon = await this.PokemonModel.findOne({ name: term });
    } else {
      // Si `term` es un número, buscarlo por su número de la Pokédex
      pokemon = await this.PokemonModel.findOne({ no: +term });
    }
    //Mongo ID
    if (!pokemon && isValidObjectId(term)){
      pokemon = await this.PokemonModel.findById(term);
    }
    //Name
    if (!pokemon){
      pokemon = await this.PokemonModel.findOne({name: term.toLowerCase().trim()})
    }
    // Retorna el resultado o lanza un error si no se encuentra
    if (!pokemon) {
      throw new Error(`Pokemon with term '${term}' not found.`);
    }
  
    return pokemon;
  }
  

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const Pokemon = await this.findOne(term);
      if (!Pokemon) {
        throw new NotFoundException(`Pokemon with term "${term}" not found`);
      }
  
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }
      await Pokemon.updateOne(updatePokemonDto);
      return this.findOne(term); 
    } catch (error) {
      this.handleExeptions(error)
    }
  }
  //remove
  async remove(id: string) {
    //const Pokemon = await this.findOne(id)
    //await Pokemon.deleteOne()
    //return { id }
    //const result = await this.PokemonModel.findByIdAndDelete(id)
    const {deletedCount} = await this.PokemonModel.deleteOne({_id: id})
    if(deletedCount === 0 )
      throw new BadRequestException(`Pokemon with ${id} not found`)
    return 
  }
  private handleExeptions(error: any){
    if (error.code === 11000){
      throw new BadRequestException(`Este dato ya existe en ${JSON.stringify(error.keyValue)}`)
    }
    console.error('Error updating Pokémon:', error);
    throw new InternalServerErrorException('Could not update Pokémon');
  }

}
