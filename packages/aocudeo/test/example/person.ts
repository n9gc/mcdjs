const a = Promise.resolve.bind(Promise);
Promise.resolve = <T>(n?: T) => a(n).then((a: any) => (a && console.log(a), a));

import Organizer from "../../async";

export interface Person {
  shorts?: 'shorts';
  shoes?: 'shoes';
  tied: boolean;
}

const organizer = new Organizer<Person>()
  .addPositions({
    putOnShoes: 'putOnShorts',
    tieShoes: { postOf: 'putOnShoes' },
  })
  .addWorkers({
    async putOnShoes({ data: person }) {
      person.shoes = await Promise.resolve('shoes');
    },
    async tieShoes({ data: person }) {
      person.tied = await Promise.resolve(true);
    },
    async putOnShorts({ data: person }) {
      person.shorts = await Promise.resolve('shorts');
    },
  });

export async function getPerson() {
  return await organizer.execute({ tied: false });
}

getPerson().then(a => console.log(a));