# Spec
this is what a planned for this app 

## Main idea
make a [nook desktop](https://github.com/mn6/nook-desktop) like cross-platform app but heavily moddable/hackable.

### exemple
to be feature equivalent to nook desktop it will be split like this

```mermaid
flowchart LR
    
    subgraph main_app
        main_handler
        main_track_Handler
        main_widget_handler
        audio_handler["audio_handler \n (other audio effect/piste)"]
    end

    subgraph plugin 
        subgraph rain_sound
            direction LR
            rain_track_player --> audio_handler
            rain_volume_widget --> main_widget_handler
        end

        subgraph nook_Beel
            nook_beel_widget --> main_handler 
            nook_beel_widget-- onclick --> nook_beel_edit_menu
            nook_beek_player --> audio_handler
        end

        subgraph nook_track
            nook_track_3ds --> main_track_Handler
            nook_track_wii --> main_track_Handler
            ... --> main_track_Handler
        end

    end
```

so basically :
 - main app 
   - widget placement
   - main track management
   - audio handler
 - widget
   - main track playlists
   - other track on top of the main one
   - widget logic

## interface
interface for plugin 

> prototype


``` typescript

interface widget { 
    name: string;
    minSize?: { width: number; height: number };
    maxSize?: { width: number; height: number };
    
    render: ReactComponent; // probably going to use a iframe of some kinf
}

interface playlist { 
    name: string;
    getTrack: () => AudioFile
}
```
