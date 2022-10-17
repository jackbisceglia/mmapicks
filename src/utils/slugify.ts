// TODO: decide whether to handle this conversion client or server side
const slugify = (groupname: string) =>
  groupname.toLowerCase().replace(/\s/g, "-");

const unslugify = (slug: string) => slug.replace(/-/g, " ");

export { slugify, unslugify };
