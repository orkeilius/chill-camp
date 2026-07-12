import {describe, it, expect} from "vitest";
import Mod from "../../src/interface/Mod";
import SystemWidgetMod from "../../src/mod/systemWidgetMod/SystemWidgetMod";
import TestMod from "../../src/mod/TestMod/TestMod";
import modService from "../../src/services/modService";

describe("Mod abstract class", () => {
    it("should have default getPlaylists and getWidget returning empty arrays", () => {
        class ConcreteMod extends Mod {
            name = "Concrete";
        }

        const mod = new ConcreteMod();
        expect(mod.getPlaylists()).toEqual([]);
        expect(mod.getWidget()).toEqual([]);
    });
});

describe("SystemWidgetMod", () => {
    it("should expose name and EditWidget", () => {
        const mod = new SystemWidgetMod();
        expect(mod.name).toBe("System widget");
        const widgets = mod.getWidget();
        expect(widgets).toHaveLength(1);
        expect(widgets[0].name).toBe("Edit grid buttom");
    });
});

describe("TestMod", () => {
    it("should expose name, playlists, and widgets", () => {
        const mod = new TestMod();
        expect(mod.name).toBe("TestMod");
        const playlists = mod.getPlaylists();
        expect(playlists).toHaveLength(1);
        expect(playlists[0].name).toBe("TestPlaylist");
        const widgets = mod.getWidget();
        expect(widgets).toHaveLength(1);
        expect(widgets[0].name).toBe("Test Widget 1");
    });

    it("should return a URL from TestPlaylist", () => {
        const mod = new TestMod();
        const playlist = mod.getPlaylists()[0];
        const url = playlist.getNextMusic();
        expect(url).toBeInstanceOf(URL);
    });
});

describe("ModService", () => {
    it("should collect widgets and playlists from all registered mods", () => {
        expect(modService.listOfMods).toHaveLength(3);
        // NookMod returns a SunnyAcnrPlaylist, TestMod returns a TestPlaylist
        expect(modService.listOfPlaylists).toHaveLength(2);
        expect(modService.listOfWidgets).toHaveLength(2);
    });
});
