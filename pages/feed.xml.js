import Web3 from "web3";
import ChannelAbi from "../artifacts/contracts/Channel.sol/Channel.json";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const ChannelContract = new web3.eth.Contract(
  ChannelAbi.abi,
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"
);

const getChannelInfo = async () => {
  const res = await ChannelContract.methods.getChannelInfo().call();
  return {
    title: res.title,
    author: res.author,
    description: res.description,
    email: res.email,
    arweaveImgID: res.arweaveImgID,
    keywords: res.keywords,
  };
};

const FeedPage = () => null;

function setFeed(data) {
  console.log(data);

  return `
  <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:creativeCommons="http://backend.userland.com/creativeCommonsRssModule" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
      <channel>
          <atom:link href="https://example.com/rss/myawesomepodcast.xml" rel="self" type="application/rss+xml" />
          <title>${data.title}</title>
          <link>https://example.com/podcast</link>
          <description>${data.description}</description>
          <managingEditor>${data.email}</managingEditor>
          <webMaster>${data.email}</webMaster>
          <language>en-us</language>
          <copyright>Copyright (C) 2018 ${data.title}. All Rights Reserved.</copyright>
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
          <item>

          </item>
      </channel>
  </rss>`;
}
// This gets called on every request
export async function getServerSideProps({ res }) {
  console.log("ok: ", window.origin);
  const channelInfo = await getChannelInfo();

  const feed = await setFeed(channelInfo);

  //Set page headers
  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  //Set cache for 600s so it wont call our wp on every request.
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate");
  res.write(feed);
  res.end();
  // Pass data to the page via props
  return { props: {} };
}
export default FeedPage;
