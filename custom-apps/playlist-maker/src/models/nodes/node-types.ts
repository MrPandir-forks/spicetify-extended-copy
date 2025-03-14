import { type ComponentType } from 'react';
import { type NodeProps } from 'reactflow';
import { LikedSongsSourceNode } from '../../components/nodes/sources/LikedSongs/LikedSongsSourceNode';
import { ResultNode } from '../../components/nodes/result/ResultNode';
import { LocalTracksSourceNode } from '../../components/nodes/sources/LocalTracks/LocalTracksSourceNode';
import { DeduplicateNode } from '../../components/nodes/processing/DeduplicateNode';
import { GenreNode } from '../../components/nodes/filter/GenreNode';
import { LibraryPlaylistSourceNode } from '../../components/nodes/sources/LibraryPlaylist/LibraryPlaylistSourceNode';
import { ShuffleNode } from '../../components/nodes/processing/ShuffleNode';
import { TopTracksSourceNode } from '../../components/nodes/sources/TopTracks/TopTracksSourceNode';
import { IsPlayableNode } from '../../components/nodes/filter/IsPlayableNode';
import { SortProcessorNode } from '../../components/nodes/processing/SortProcessorNode';
import { AcousticnessNode } from '../../components/nodes/filter/AcousticnessNode';
import { DanceabilityNode } from '../../components/nodes/filter/DanceabilityNode';
import { EnergyNode } from '../../components/nodes/filter/EnergyNode';
import { InstrumentalnessNode } from '../../components/nodes/filter/InstrumentalnessNode';
import { LivenessNode } from '../../components/nodes/filter/LivenessNode';
import { LoudnessNode } from '../../components/nodes/filter/LoudnessNode';
import { SpeechinessNode } from '../../components/nodes/filter/SpeechinessNode';
import { ValenceNode } from '../../components/nodes/filter/ValenceNode';
import { TempoNode } from '../../components/nodes/filter/TempoNode';

export type CustomNodeType =
    // Sources
    | 'likedSongsSource'
    | 'localTracksSource'
    | 'libraryPlaylistSource'
    | 'topTracksSource'
    // Filters
    | 'genre'
    | 'isPlayable'
    | 'acousticness'
    | 'danceability'
    | 'energy'
    | 'instrumentalness'
    | 'liveness'
    | 'loudness'
    | 'speechiness'
    | 'valence'
    | 'tempo'
    // Processing
    | 'deduplicate'
    | 'shuffle'
    | 'sort'
    // Result
    | 'result';

export const nodeTypes: Record<CustomNodeType, ComponentType<NodeProps>> = {
    likedSongsSource: LikedSongsSourceNode,
    localTracksSource: LocalTracksSourceNode,
    libraryPlaylistSource: LibraryPlaylistSourceNode,
    topTracksSource: TopTracksSourceNode,
    deduplicate: DeduplicateNode,
    genre: GenreNode,
    isPlayable: IsPlayableNode,
    result: ResultNode,
    shuffle: ShuffleNode,
    sort: SortProcessorNode,
    acousticness: AcousticnessNode,
    danceability: DanceabilityNode,
    energy: EnergyNode,
    instrumentalness: InstrumentalnessNode,
    liveness: LivenessNode,
    loudness: LoudnessNode,
    speechiness: SpeechinessNode,
    valence: ValenceNode,
    tempo: TempoNode,
};
