const DefaultAvatars: Record<string, string> = {
  BLURPLE: '6debd47ed13483642cf09e832ed0bc1b',
  GREY: '322c936a8c8be1b803cd94861bdfa868',
  GREEN: 'dd4dbc0016779df1378e7812eabaa04d',
  ORANGE: '0e291f67c9274a1abdddeb3fd919cbaa',
  RED: '1cbd08c76f8af6dddce02c5138971129',
};

export function getUserAvatarUrl(
  id: string,
  discriminator: string,
  avatar: string | null,
) {
  const avatars = Object.keys(DefaultAvatars);
  const defaultAvatar = avatars[Number(discriminator) % avatars.length];

  const userDefaultAvatar = `https://discordapp.com/assets/${DefaultAvatars[defaultAvatar]}.png`;

  return avatar
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
    : userDefaultAvatar;
}
