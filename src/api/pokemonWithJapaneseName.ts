import { INITIAL_POKEMON_LIST_LIMIT } from '../config';
import { fetchPokemonList } from './pokemon';
import type { PokemonListResult } from './pokemon';
import type { Pokemon } from './pokemon.type';
import { fetchPokemonJapaneseName } from './pokemonSpecies';

// 日本語名を含むポケモンの情報
export type PokemonWithJapaneseName = {
  name: string;
  url: string;
  japaneseName: string;
  number: string;
  types: Pokemon['types'];
  abilities: Pokemon['abilities'];
};

// 日本語名を含む一覧の取得結果
export type PokemonListWithJapaneseNames = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonWithJapaneseName[];
};

// 日本語名を含むポケモン一覧を取得
export const fetchPokemonListWithJapaneseNames = async (
  offset: number = 0,
  limit: number = INITIAL_POKEMON_LIST_LIMIT
): Promise<PokemonListWithJapaneseNames> => {
  // 1. 一覧を取得
  const pokemonList: PokemonListResult =
    await fetchPokemonList(offset, limit);

  // 2. 各ポケモンの詳細と日本語名を取得
  const updatedResults: PokemonWithJapaneseName[] =
    await Promise.all(
      pokemonList.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);

        if (!response.ok) {
          throw new Error('ポケモンの詳細情報の取得に失敗しました');
        }

        const pokemonDetails: Pokemon = await response.json();

        const speciesUrl = pokemonDetails.species.url;
        const japaneseName = await fetchPokemonJapaneseName(
          speciesUrl,
          pokemon.name
        );

        return {
          ...pokemon,
          japaneseName,
          number:
            speciesUrl.split('/').filter(Boolean).pop() ??
            pokemonDetails.id.toString(),
          types: pokemonDetails.types,
          abilities: pokemonDetails.abilities,
        };
      })
    );

  // 3. 一覧の結果を更新して返す
  return { ...pokemonList, results: updatedResults };
};