export interface Playlist {
    name: string;
    getNextMusic: () => URL
}