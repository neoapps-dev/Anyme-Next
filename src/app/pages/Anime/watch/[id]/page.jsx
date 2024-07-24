"use client";
import {
  FetchAnimeByID,
  FetchEpisodesData,
  FetchStreamingData,
} from "@/hooks/useApi";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  faBars,
  faImage,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import VideoPlayer from "@/components/Anime/Watch/VideoPlayer";
import EpisodeList from "@/components/Anime/Watch/EpisodeList";
import BasicDetails from "@/components/Anime/BasicDetails";
import AnimeRelation from "@/components/Anime/Watch/AnimeRelations";
import ReusableVerticalCarousel from "@/components/Anime/Watch/ReusableVerticalCarousel";

const StreamingPage = () => {
  const { id } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const icons = [faBars, faTableCells, faImage];
  const [episodesData, setEpisodesData] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [episodeSrc, setEpisodeSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [episodeLoading, setEpisodeLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await FetchEpisodesData(id);
      setEpisodesData(data);
      setIsLoading(false);
      const MetaData = await FetchAnimeByID(id);
      setAnimeData(MetaData);
    };
    loadData();
  }, [id]);

  useEffect(() => {
    const loadEpisodeData = async () => {
      try {
        if (episodesData) {
          setEpisodeLoading(true);
          const episodeData = await FetchStreamingData(
            episodesData[currentEpisode - 1].id
          );
          const filteredLink = episodeData.find(
            (episode) => episode.quality === "default"
          );
          setEpisodeSrc(filteredLink.url);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setEpisodeLoading(false);
      }
    };
    loadEpisodeData();
  }, [currentEpisode, episodesData]);

  const handleClick = (number) => {
    setCurrentEpisode(number);
  };

  if (isLoading || !episodesData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col px-5 gap-3">
      <div className="flex flex-row justify-between h-[600px]">
        <VideoPlayer
          episodeLoading={episodeLoading}
          episodeSrc={episodeSrc}
          episodesData={episodesData}
          currentEpisode={currentEpisode}
        />
        <EpisodeList
          episodesData={episodesData}
          currentEpisode={currentEpisode}
          icons={icons}
          handleClick={handleClick}
        />
      </div>
      {animeData ? (
        <div className="flex flex-row w-full justify-between h-[920px]">
          <div className="flex flex-col w-[72%] justify-between">
            <BasicDetails data={animeData} page="Streaming"/>
            <AnimeRelation relations={animeData.relations}/>
          </div>
          <div className="flex flex-col w-[26%] h-full justify-between">
            <ReusableVerticalCarousel data={animeData.relations} title={'Related'} />
            <ReusableVerticalCarousel data={animeData.recommendations} title={'Recommendations'} />
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default StreamingPage;
