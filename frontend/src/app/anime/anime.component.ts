import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  providers: [MessageService, ConfirmationService]
})
export class AnimeComponent implements OnInit {

  putOrPost: boolean
  animeDialogo: boolean;
  submetido: boolean;
  animes: any = [];
  status: any = [];
  fotos: any = [];
  anime: any = {};

  constructor(private http: HttpClient, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.pesquisarAnime()

    this.status = [
      { label: 'Planejando', value: 'Planejando' },
      { label: 'Assistindo', value: 'Assistindo' },
      { label: 'Em Espera', value: 'Em Espera' },
      { label: 'Finalizado', value: 'Finalizado' }
    ];

    this.fotos = [
      { name: 'assets/miniatura01.jpg' },
      { name: 'assets/miniatura02.jpg' },
      { name: 'assets/miniatura03.jpg' },
      { name: 'assets/miniatura04.jpg' },
      { name: 'assets/miniatura07.jpg' },
      { name: 'assets/miniatura08.jpg' },
      { name: 'assets/miniatura09.jpg' },
      { name: 'assets/miniatura10.jpg' },
      { name: 'assets/miniatura11.jpg' },
      { name: 'assets/miniatura00.jpg' }
    ];
  }

  limparCampos() {
    this.anime = {
      _id: '',
      titulo: '',
      estudio: '',
      status: '',
      progresso: 0,
      nota: 0
    }
  }

  pesquisarAnime() {
    this.limparCampos();
    this.http.get(`http://localhost:4000/animes`)
      .subscribe(resultado => this.animes = resultado);
  }

  criarAnime() {
    this.putOrPost = false;
    this.submetido = false;
    this.animeDialogo = true;
  }

  editAnime(anime) {
    this.putOrPost = true;
    this.animeDialogo = true;

    this.anime._id = anime._id
    this.anime.titulo = anime.titulo
    this.anime.estudio = anime.estudio
    this.anime.status = anime.status
    this.anime.progresso = anime.progresso
    this.anime.nota = anime.nota
  }

  deleteAnime(anime) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete(`http://localhost:4000/animes/${anime._id}`)
          .subscribe(
            resultado => {
              this.pesquisarAnime();
            }
          );
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Anime Deletado!', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.limparCampos()
    this.animeDialogo = false;
    this.submetido = false;
  }

  saveAnime() {
    this.submetido = true;

    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(this.anime);

    if (this.anime.titulo !== '' && this.anime.estudio !== '' && this.anime.status !== '') {
      if (this.putOrPost) {
        const { _id } = this.anime

        this.http.put<any>(`http://localhost:4000/animes/${_id}`, body, { headers })
          .subscribe(
            () => {
              this.pesquisarAnime();
            });
        this.hideDialog();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Anime Atualizado!', life: 3000 });
      }
      else {
        this.http.post<any>('http://localhost:4000/animes', body, { headers })
          .subscribe(() => {
            this.pesquisarAnime();
          });
        this.hideDialog()
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Anime Criado!', life: 3000 });
      }
    }
  }
}
