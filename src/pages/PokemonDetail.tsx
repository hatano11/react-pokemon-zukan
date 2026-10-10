import { Link } from 'react-router-dom'
import PageHeading from '../components/PageHeading'

export default function PokemonDetail() {
  return (
    <main className="mx-auto max-w-3xl p-4">
      <PageHeading title="ポケモン詳細" />
      <p className="mb-4">
        ここには、後で選んだポケモンの情報を表示します。
      </p>
      <Link className="underline" to="/">
        一覧へ戻る
      </Link>
    </main>
  )
}