import { Injectable, Module } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async executeSeed(){

    await this.pokemonModel.deleteMany({}) // Esto es igual a delete * from pokemon elimina todos los registros de la tabla pokemon

    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    // const insertPromisesArray = [] Esto es para inserciones multiples

    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach(async ({name, url}) => {

      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      // const pokemon = await this.pokemonModel.create({name, no})

      // insertPromisesArray.push(this.pokemonModel.create({name, no})) Esto es para inserciones multiples

      pokemonToInsert.push({name, no})

      console.log({name, no})
    })

    // await Promise.all(insertPromisesArray) Esto es para inserciones multiples
    await this.pokemonModel.insertMany(pokemonToInsert)

    return "Seed executed";
  }


}
