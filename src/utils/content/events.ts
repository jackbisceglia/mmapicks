import f from "./fighters";

type FighterInput = {
  fname: string;
  lname: string;
  wins: number;
  losses: number;
  noContests: number;
  weight: string;
  height: string;
};

type FightInput = {
  fighters: FighterInput[];
};
type EventInput = {
  title: string;
  date: Date;
  promotion: string;
  fights: FightInput[];
};

const events: EventInput[] = [
  {
    title: "UFC 280",
    date: new Date("2022-10-22"),
    promotion: "UFC",
    fights: [
      {
        fighters: [f.charles, f.islam],
      },
      {
        fighters: [f.aljo, f.tj],
      },
      {
        fighters: [f.suga, f.petr],
      },
    ],
  },
  {
    title: "UFC 281",
    date: new Date("2022-11-12"),
    promotion: "UFC",
    fights: [
      {
        fighters: [f.izzy, f.pereira],
      },
      {
        fighters: [f.esparza, f.zhang],
      },
      {
        fighters: [f.dustin, f.chandler],
      },
    ],
  },
];

export default events;
