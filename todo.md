# Project TODO List

This file tracks the major issues and tasks for the Salasel 2.0 project.

## High Priority

- **[BUG]** Video does not load on initial client-side navigation to the playlist page. It only works after a hard reload. This is likely a component mounting or initialization issue with the video player.
- **[BUG]** The video thumbnail is incorrectly displayed on top of the video player, obstructing the view.
- **[REFACTOR]** The overall HTML layout and CSS for the playlist page needs to be reviewed and fixed to match the design.
- **[FEATURE]** Implement video selection functionality in the `PlaylistSidebar`. Clicking a video in the list should change the video playing in the `VideoPlayer`.
- **[FEATURE]** Implement the tab-switching logic and placeholder UI for the `VideoDetailsTabs` component (Search, Summary, Transcription).
- **[FEATURE]** Ensure basic video player functionalities (play, pause, seek, volume) are working correctly with the chosen library.

## Medium Priority
- **[BUG]** Debug image loading indicator (spinner/shimmer) not appearing on `SelectedPlaylistCard`. The `onLoad` event or a styling/stacking issue might be preventing the loading state from being visible.


- retrieve the video player page from previous git commits
- make the image reoslution responsive based on screen sizes.

