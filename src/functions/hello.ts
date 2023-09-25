import { tryFn } from "../utilities/tryFn";
import axios from 'axios'

export const handler = async () => {
  const [ok, name] = await tryFn(async () => {
    const { data } = await axios.get<{ name: string }>("https://rickandmortyapi.com/api/character/2")

    return data.name
  })

  return {
    message: ok ? name : "NOONE",
  };
};
