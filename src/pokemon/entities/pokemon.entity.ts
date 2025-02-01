// Importamos las decoraciones y clases necesarias de Mongoose y NestJS
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";  // Importamos las herramientas para definir un esquema en Mongoose dentro de NestJS
import { Document } from "mongoose";  // Importamos la clase `Document` de Mongoose para extenderla en nuestra clase

// Definimos el esquema de la colección "Pokemon" usando un decorador
@Schema()  // Este decorador marca la clase `Pokemon` como un modelo de Mongoose (es decir, como un esquema de base de datos)
export class Pokemon extends Document {  // La clase `Pokemon` extiende `Document`, lo que le da las funcionalidades de Mongoose, como `save()`, `find()`, etc.

    // Definimos el campo 'name' para almacenar el nombre del Pokémon
    @Prop({
        unique: true,  // Esto asegura que el valor de 'name' sea único en la base de datos
        index: true    // Esto crea un índice en el campo 'name', lo que mejora la velocidad de las consultas basadas en este campo
    })
    name: string;  // Definimos la propiedad 'name', que será de tipo cadena de texto (string) y contiene el nombre del Pokémon

    // Definimos el campo 'no' para almacenar el número del Pokémon
    @Prop({
        unique: true,  // Esto asegura que el valor de 'no' (número del Pokémon) sea único en la base de datos
        index: true    // Esto también crea un índice en el campo 'no', para mejorar la velocidad de las búsquedas
    })
    no: number;  // Definimos la propiedad 'no', que será un número (number) y contiene el número del Pokémon (por ejemplo, 1 para Bulbasaur)
}

// Usamos `SchemaFactory.createForClass(Pokemon)` para crear el esquema de Mongoose a partir de la clase `Pokemon`
// Esto genera el esquema que Mongoose necesita para interactuar con la base de datos.
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
