import AbstractHourlyPlaylist from "./AbstractHourlyPlaylist";

export default class SunnyAcnrPlaylist extends AbstractHourlyPlaylist {
  name = "AC new Horizon - sunny";
  musics = {
    0: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/02.%201200%20AM%20%28Sunny%29.mp3"),
    1: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/03.%20100%20AM%20%28Sunny%29.mp3"),
    2: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/04.%20200%20AM%20%28Sunny%29.mp3"),
    3: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/05.%20300%20AM%20%28Sunny%29.mp3"),
    4: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/06.%20400%20AM%20%28Sunny%29.mp3"),
    5: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/07.%20500%20AM%20%28Sunny%29.mp3"),
    6: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/08.%20600%20AM%20%28Sunny%29.mp3"),
    7: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/09.%20700%20AM%20%28Sunny%29.mp3"),
    8: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/10.%20800%20AM%20%28Sunny%29.mp3"),
    9: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/11.%20900%20AM%20%28Sunny%29.mp3"),
    10: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/12.%201000%20AM%20%28Sunny%29.mp3"),
    11: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/13.%201100%20AM%20%28Sunny%29.mp3"),
    12: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/14.%201200%20PM%20%28Sunny%29.mp3"),
    13: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/15.%20100%20PM%20%28Sunny%29.mp3"),
    14: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/16.%20200%20PM%20%28Sunny%29.mp3"),
    15: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/17.%20300%20PM%20%28Sunny%29.mp3"),
    16: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/18.%20400%20PM%20%28Sunny%29.mp3"),
    17: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/19.%20500%20PM%20%28Sunny%29.mp3"),
    18: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/20.%20600%20PM%20%28Sunny%29.mp3"),
    19: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/21.%20700%20PM%20%28Sunny%29.mp3"),
    20: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/22.%20800%20PM%20%28Sunny%29.mp3"),
    21: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/23.%20900%20PM%20%28Sunny%29.mp3"),
    22: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/24.%201000%20PM%20%28Sunny%29.mp3"),
    23: new URL("https://archive.org/download/acnr-soundtrack/Disc%201/25.%201100%20PM%20%28Sunny%29.mp3"),
  } as Record<number, URL>;
}
