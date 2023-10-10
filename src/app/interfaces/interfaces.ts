export interface Article {
    title: string
    author: string
    published_date: string
    content: string
    category: string,
    tags: string[],
    image_url: string,
    likes: number,
    comments:Comment[]
}

interface Comment{
    user: string,
    comment: string
}

export interface Response<T>{
    data:T
}