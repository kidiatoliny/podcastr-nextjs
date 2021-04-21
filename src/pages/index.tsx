import { parseISO, format } from "date-fns"
import pt from "date-fns/locale/pt"
import { GetStaticProps } from "next"
import { api } from "../services/api"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"
import Image from 'next/image'
import Link from 'next/link'
import styles from './home.module.scss'
interface Episode {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string
  duration: number
  durationAsString: string,
  url: string
}

type HomeProps = {
  lastEpisodes: Episode[]
  allEpisodes: Episode[]

}
export default function Home({ lastEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.lastEpisodes}>
        <h2>Ultimos Episodios</h2>
        <ul>
          {lastEpisodes.map(episode => (
            <li key={episode.id}>

              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover" />
              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  <a >{episode.title}</a></Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>
              <button type="button">
                <img src="/play-green.svg" alt="Tocar episodio" />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os Episodios</h2>
        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map(episode => (
              <tr key={episode.id}>
                <td style={{ width: 72 }}>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />

                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a >{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button>
                    <img src="/play-green.svg" alt=" Tocar episodio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </section>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMMM yy', {
        locale: pt
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(episode.file.duration),
      url: episode.file.url
    }
  })
  const lastEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)
  return {
    props: {
      lastEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }

}