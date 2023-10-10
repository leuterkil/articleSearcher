import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, from, fromEvent  } from 'rxjs';
import {debounce, debounceTime, distinctUntilChanged, filter, map,  switchMap, toArray} from 'rxjs/operators'
import db from 'src/app/db/seed'
import { Article, Response } from './interfaces/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy {

  subscriptions = new Subscription();

  articles:Article[] = []

  ngOnInit(): void {
    this.fetchAllArticles().subscribe(res=>this.articles = res.data.articles);
  }

  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchAllArticles():Observable<Response<{articles:Article[]}>>{
    return new Observable((subscriber)=>{
      setTimeout(()=>{
        const data = {
          data:{
            articles:db.articles
          }
        }

        subscriber.next(data);
        subscriber.complete();
      },1000)
    })
  }

  filterByTagStream(tag:string):Observable<Response<{articles:Article[]}>>{
    const source = from(db.articles);

    const filterByTagArticles$ = source.pipe(
      filter(article=>article.tags.includes(tag)),
      toArray(),
      map(filteredArticles=>({data:{articles:filteredArticles}})));

    return filterByTagArticles$;
  }

  searchByKeywordStream():Observable<Response<{articles:Article[]}>>{

    return fromEvent(document.querySelector('#searcher') as HTMLInputElement, 'input').pipe(
      debounceTime(750), // Wait for 2 seconds pause in events
      map((event: Event) => (event.target as HTMLInputElement).value), // Extract input value
      distinctUntilChanged(), // Only proceed if the input value changes
      switchMap((term) => {
        if (term.trim() === '') {
          // If the search term is empty, return the original articles immediately
          return new Observable<Response<{ articles: Article[] }>>((observer) => {
            observer.next({ data: { articles: db.articles } });
            observer.complete();
          });
        } else {
          // Otherwise, filter the articles and return the filtered results
          const filteredArticles = db.articles.filter((article: Article) =>
            article.title.includes(term)
          );
          return new Observable<Response<{ articles: Article[] }>>((observer) => {
            observer.next({ data: { articles: filteredArticles } });
            observer.complete();
          });
        }
      })
    );
  }

  search(){
    this.searchByKeywordStream().subscribe(res=>this.articles = res.data.articles);
  }

  filterByTag(event:Event){
    const tag = (event.target as HTMLInputElement).value;
    if(tag===""){
      this.fetchAllArticles().subscribe(res=>this.articles = res.data.articles);
    }
    else
      this.filterByTagStream(tag).subscribe(res=>this.articles = res.data.articles)
  }


  
}
