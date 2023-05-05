const token = process.env.UPSTASH_REDIS_REST_TOKEN
const url = process.env.UPSTASH_REDIS_REST_URL
type command = 'zrange' | 'sismember' | 'smembers' | 'get'

export const CommandRedis = async (
  command: command,
  ...args: (number | string)[]
) => {
  const commandURL = `${url}/${command}/${args.join('/')}`

  const response = await fetch(commandURL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-cache',
  })

  if (!response.ok) {
    throw new Error(`error execution redis command:${response.statusText}`)
  }
  const data = await response.json()
  return data.result
}
