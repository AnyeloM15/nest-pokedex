import { IsNotEmpty, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsNotEmpty()
    @IsPositive()
    @Min(1)
    no:number;
    
    @IsString()
    @MinLength(1)
    name: string;

}
