
export default class TestPlaylist implements Playlist {
    name = "TestPlaylist";

    musics: URL[] = [
        new URL("https://d9olupt5igjta.cloudfront.net/samples/sample_files/784615/612c2ab1fa79410d06f866153a1a8c2e2912f8e8/mp3/_hhsd.mp3?1782759971"),
        new URL("https://d9olupt5igjta.cloudfront.net/samples/sample_files/785288/41913dce1ccf9907dd3277c8f7c5a8fb64cdd64e/mp3/_Aminor_cords_City_lights.mp3?1782906378"),
        new URL("https://d9olupt5igjta.cloudfront.net/samples/sample_files/785846/6eaedf59f5db2ad82ff62598f35e54d0f86f454d/mp3/_SS_GNV3_13_Music_150_Cmaj_16.mp3?1783021658"),
        new URL("https://d9olupt5igjta.cloudfront.net/samples/sample_files/783966/3144cb177dfcd28231743a5fd6f8c1f2d2d07c89/mp3/_cw_amen24_111.mp3?1782708121")
    ];

    getNextMusic(): URL {

        return this.musics[Math.floor(Math.random() * this.musics.length)];
    }
}