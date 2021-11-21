import Web3 from "web3";
import ChannelAbi from "../../../artifacts/contracts/Channel.sol/Channel.json";
import EpisodeAbi from "../../../artifacts/contracts/Episode.sol/Episode.json";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const getEpisodes = async (channelInfo) => {
  let epis = [];

  for await (const episods of channelInfo.episodes.map((item) => {
    const EpisodeContract = new web3.eth.Contract(EpisodeAbi.abi, item);
    return EpisodeContract.methods.getEpisodeInfo().call();
  })) {
    epis.push(episods);
  }
  channelInfo.episodes = epis;
  return channelInfo;
};

const getChannelInfo = async (id) => {
  const ChannelContract = new web3.eth.Contract(ChannelAbi.abi, id);
  const res = await ChannelContract.methods.getChannelInfo().call();

  const eps = await ChannelContract.methods.getEpisodes().call();
  return {
    title: res.title,
    author: res.author,
    description: res.description,
    email: res.email,
    arweaveImgID: res.arweaveImgID,
    keywords: res.keywords,
    episodes: eps,
  };
};

const FeedPage = () => null;

const setFeed = async (d, url) => {
  return new Promise(function (resolve, reject) {
    d.then((data) => {
      resolve(`
    <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:creativeCommons="http://backend.userland.com/creativeCommonsRssModule" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
        <channel>
            <atom:link href="${url}" rel="self" type="application/rss+xml" />
            <title>${data.title}</title>
            <link>https://example.com/podcast</link>
            <description>${data.description}</description>
            <managingEditor>${data.email}</managingEditor>
            <webMaster>${data.email}</webMaster>
            <language>en-us</language>
            <copyright>Copyright (C) 2018 ${
              data.title
            }. All Rights Reserved.</copyright>
            <creativeCommons:license>
                https://creativecommons.org/licenses/by-nc-nd/4.0/
            </creativeCommons:license>
            <pubDate>Sat, 27 May 2017 02:00:00 GMT</pubDate>
            <lastBuildDate>Wed, 31 Jan 2018 02:00:00 GMT</lastBuildDate>
            <image>
                <url>http://arweave.net/${data.arweaveImgID}</url>
                <title>${data.title}</title>
                <link>https://example.com/podcast</link>
            </image>
            <docs>http://www.rssboard.org/rss-specification</docs>
            <itunes:author>${data.author}</itunes:author>
            <itunes:keywords>${data.keywords}</itunes:keywords>
  
            <itunes:category text="${data.description}"/>
  
            <itunes:explicit>clean</itunes:explicit>
            <itunes:image href="http://arweave.net/${data.arweaveImgID}"/>
            <itunes:owner>
            <itunes:name><![CDATA[${data.title}]]></itunes:name>
                <itunes:email>${data.email}</itunes:email>
            </itunes:owner>
            ${data.episodes.map((i) => {
              return `
                <item>
                  <title>${i.title}</title>
                  <link>https://archive.org/details/MyAwesomePodcastEp1</link>
                  <description>
                  ${i.description}
                  </description>
                  <guid isPermaLink="true">
                    https://archive.org/details/MyAwesomePodcastEp1
                  </guid>
                  <pubDate>Fri, 26 Jan 2018 04:00:00 GMT</pubDate>
                  <media:content
                    medium="audio"
                    url="https://arweave.net/${i.audArweaveID}"
                    type="audio/mpeg"
                    isDefault="true"
                    expression="full"
                    duration="${i.duration}">
                    <media:title type="plain">${i.title}</media:title>

                    <media:description>
                    ${i.description}
                    </media:description>
                    <media:rating scheme="urn:simple">${i.rating}</media:rating>
                    <media:thumbnail url="${i.coverArweaveID}"/>
                    <media:keywords>
                        ${i.keywords}
                    </media:keywords>
                  </media:content>
                    <enclosure url="http://arweave.net/${i.audArweaveID}" length="73312022" type="audio/mpeg"/>
                    <itunes:image href="${i.coverArweaveID}"/>
                    <itunes:explicit>${i.itunesRating}</itunes:explicit>
                    <itunes:duration>${i.duration}</itunes:duration>
                </item>
              `;
            })}
            
        </channel>
    </rss>`);
    });
  });
};
// This gets called on every request
export async function getServerSideProps(context) {
  const { id } = context.query;

  const url = `${context.req.headers.host}context.req.url`;
  console.log("ID : ", id);
  const channelInfo = await getChannelInfo(id);

  const episodesInfo = getEpisodes(channelInfo);

  const feed = await setFeed(episodesInfo, url);

  setTimeout(() => {}, 4000);

  //Set page headers
  context.res.setHeader("Content-Type", "text/xml; charset=utf-8");
  //Set cache for 600s so it wont call our wp on every request.
  context.res.setHeader(
    "Cache-Control",
    "s-maxage=600, stale-while-revalidate"
  );
  context.res.write(feed);
  context.res.end();
  // Pass data to the page via props
  return { props: {} };
}
export default FeedPage;
