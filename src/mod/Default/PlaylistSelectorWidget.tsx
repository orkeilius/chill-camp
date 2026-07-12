import { ReactElement, useEffect, useState } from "react";
import { Widget } from "../../interface/widget";
import mainTrackService from "../../services/mainTrackService";
import { Playlist } from "../../interface/Playlist";
import modService from "../../services/modService";

export const PlaylistSeletorWidget: Widget = {
    name: "Playlist slector",
    minSize: { height: 1, width: 3 },
    maxSize: { height: 4, width: 2 },
    content: Content,
};

function Content(): ReactElement {
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
        null,
    );

    useEffect(() => {
        setSelectedPlaylist(mainTrackService.getCurrentPlaylist());
    }, []);

    const changePlaylist = (value: string) => {
        const playlist = modService.listOfPlaylists.find(
            (p) => p.name == value,
        );
        if (!playlist) {
            console.error("slected playlist not found");
            return;
        }
        console.log("selectedPlaylist " + playlist.name);
        setSelectedPlaylist(playlist);
        mainTrackService.changePlaylist(playlist);
    };

    return (
        <div>
            <select
                value={selectedPlaylist?.name}
                onChange={(e) => changePlaylist(e.currentTarget.value)}
            >
                {modService.listOfPlaylists.map((p) => {
                    return (
                        <option key={p.name} value={[p.name]}>
                            {p.name}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
