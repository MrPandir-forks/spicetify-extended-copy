import styles from '../../../css/app.module.scss';
import React, { useMemo, useState } from 'react';
import { TrackListGrid } from '../../shared/track-list/TrackListGrid';
import { playContext, playTrack } from '../../../utils/player.utils';
import type {
    DisplayType,
    SelectedSortOption,
    SortOption,
    SortOrder,
} from 'custom-apps/better-local-files/src/models/sort-option';
import type { TrackListHeaderOption } from 'custom-apps/better-local-files/src/models/track-list-header-option';
import type { HeaderKey } from 'custom-apps/better-local-files/src/constants/constants';
import { SortMenu } from '../../shared/filters/SortMenu/SortMenu';
import { SearchInput } from '../../shared/filters/SearchInput/SearchInput';
import { PlayButton } from '../../shared/buttons/PlayButton';
import { TrackListRowAlbumLink } from '../../shared/track-list/TrackListRowAlbumLink';
import { TrackListRowImageTitle } from '../../shared/track-list/TrackListRowImageTitle';
import { sort } from 'custom-apps/better-local-files/src/utils/sort.utils';
import type { Track } from 'custom-apps/better-local-files/src/models/track';
import { getTranslation } from 'custom-apps/better-local-files/src/utils/translations.utils';
import { TrackListRowArtistLink } from '../../shared/track-list/TrackListRowArtistLink';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

export type Props = {
    tracks: Track[];
};

// TODO: Get / store global view mode
// Spicetify.Platform.LocalStorageAPI.items[Spicetify.Platform.LocalStorageAPI.createNamespacedKey("view-mode")]

// TODO: Store sort option

/**
 * Contains the filtering, ordering, and play logic for a list of tracks.
 */
export function TrackList(props: Readonly<Props>): JSX.Element {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    /**
     * Options for the sort dropdown.
     */
    const sortOptions: SortOption[] = [
        {
            key: 'date',
            label: getTranslation(['sort.date-added']),
        },
        {
            key: 'title',
            label: getTranslation(['sort.title']),
        },
        {
            key: 'artist',
            label: getTranslation(['sort.artist']),
        },
        {
            key: 'album',
            label: getTranslation(['sort.album']),
        },
        {
            key: 'duration',
            label: getTranslation(['sort.duration']),
        },
    ];

    const [selectedSortOption, setSelectedSortOption] =
        useState<SelectedSortOption>({ ...sortOptions[0], order: 'ascending' });

    const [selectedDisplayType, setSelectedDisplayType] =
        useState<DisplayType>('list');

    const headers: TrackListHeaderOption[] = [];

    if (selectedDisplayType === 'list') {
        // First header can be artist or title
        headers.push(
            selectedSortOption.key === 'artist'
                ? {
                      key: 'artist',
                      label: getTranslation(['artist']),
                  }
                : {
                      key: 'title',
                      label: getTranslation(['tracklist.header.title']),
                  },
        );
    } else {
        headers.push(
            {
                key: 'title',
                label: getTranslation(['tracklist.header.title']),
            },
            {
                key: 'artist',
                label: getTranslation(['artist']),
            },
        );
    }

    headers.push(
        {
            key: 'album',
            label: getTranslation(['tracklist.header.album']),
        },
        {
            key: 'date',
            label: getTranslation(['tracklist.header.date-added']),
        },
    );

    function filterTracks(tracks: Track[], search: string): Track[] {
        if (search === '') {
            return tracks;
        }

        return tracks.filter(
            (t) =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.album.name.toLowerCase().includes(search.toLowerCase()) ||
                t.artists.some((a) =>
                    a.name.toLowerCase().includes(search.toLowerCase()),
                ),
        );
    }

    function orderTracks(tracks: Track[], option: SelectedSortOption): Track[] {
        switch (option.key) {
            case 'date':
                return tracks.sort((x, y) =>
                    sort(x.addedAt, y.addedAt, option.order),
                );
            case 'title':
                return tracks.sort((x, y) =>
                    sort(x.name, y.name, option.order),
                );
            case 'artist':
                return tracks.sort((x, y) =>
                    sort(
                        x.artists.map((a) => a.name).join(', '),
                        y.artists.map((a) => a.name).join(', '),
                        option.order,
                    ),
                );
            case 'album':
                return tracks.sort((x, y) =>
                    sort(x.album.name, y.album.name, option.order),
                );
            case 'duration':
                return tracks.sort((x, y) =>
                    sort(x.duration, y.duration, option.order),
                );
            default:
                return tracks;
        }
    }

    const filteredTracks = useMemo(
        () => filterTracks(props.tracks, debouncedSearch),
        [props.tracks, debouncedSearch],
    );

    const orderedTracks = useMemo(
        () => [...orderTracks(filteredTracks, selectedSortOption)],
        [filteredTracks, selectedSortOption],
    );

    function toggleOrder(order: SortOrder): SortOrder {
        return order === 'ascending' ? 'descending' : 'ascending';
    }

    function handleSortOptionChange(
        headerKey: HeaderKey,
        fromDropdownMenu: boolean,
    ): void {
        setSelectedSortOption((previous) => {
            let newKey: HeaderKey;
            let newOrder: SortOrder;

            if (
                !fromDropdownMenu &&
                headerKey === 'title' &&
                selectedSortOption.order === 'descending' &&
                selectedDisplayType !== 'compact'
            ) {
                newKey = 'artist';
                newOrder = 'ascending';
            } else if (
                !fromDropdownMenu &&
                headerKey === 'artist' &&
                selectedSortOption.order === 'descending' &&
                selectedDisplayType !== 'compact'
            ) {
                newKey = 'title';
                newOrder = 'ascending';
            } else {
                newKey = headerKey;
                newOrder =
                    previous.key === headerKey
                        ? toggleOrder(previous.order)
                        : 'ascending';
            }

            return {
                key: newKey,
                order: newOrder,
            };
        });
    }

    return (
        <>
            <div className="main-actionBar-ActionBar contentSpacing">
                <div className="main-actionBar-ActionBarRow">
                    <div className="main-playButton-PlayButton">
                        <PlayButton
                            size="lg"
                            onClick={() => {
                                playContext(
                                    orderedTracks.map((t) => t.localTrack),
                                );
                            }}
                        />
                    </div>

                    <div className={`${styles['controls']}`}>
                        <SearchInput
                            search={search}
                            setSearch={setSearch}
                            setDebouncedSearch={setDebouncedSearch}
                        />

                        <SortMenu
                            sortOptions={sortOptions}
                            selectedSortOption={selectedSortOption}
                            setSelectedSortOption={(key) => {
                                handleSortOptionChange(key, true);
                            }}
                            displayTypes={['list', 'compact']}
                            selectedDisplayType={selectedDisplayType}
                            setSelectedDisplayType={setSelectedDisplayType}
                        />
                    </div>
                </div>
            </div>

            <TrackListGrid
                tracks={orderedTracks}
                subtracks={[]}
                gridLabel={getTranslation(['local-files'])}
                useTrackNumber={false}
                onPlayTrack={(uri) => {
                    playTrack(
                        uri,
                        orderedTracks.map((t) => t.localTrack),
                    );
                }}
                headers={headers}
                onHeaderClicked={(key) => {
                    handleSortOptionChange(key, false);
                }}
                sortedHeader={selectedSortOption}
                getRowContent={(track) => {
                    const contents = [
                        selectedDisplayType === 'compact' ? (
                            <TextComponent
                                className="main-trackList-rowTitle standalone-ellipsis-one-line"
                                variant="ballad"
                                semanticColor="textBase"
                                key={track.uri}
                            >
                                {track.name}
                            </TextComponent>
                        ) : (
                            <TrackListRowImageTitle
                                track={track}
                                withArtists={true}
                                key={track.uri}
                            />
                        ),
                    ];

                    if (selectedDisplayType === 'compact') {
                        contents.push(
                            <TrackListRowArtistLink
                                track={track}
                                key={track.uri}
                            />,
                        );
                    }

                    contents.push(
                        <TrackListRowAlbumLink track={track} key={track.uri} />,
                        <TextComponent
                            variant="mesto"
                            semanticColor="textSubdued"
                            key={track.uri}
                        >
                            {track.addedAt.toLocaleDateString()}
                        </TextComponent>,
                    );

                    return contents;
                }}
                displayType={selectedDisplayType}
            />
        </>
    );
}
