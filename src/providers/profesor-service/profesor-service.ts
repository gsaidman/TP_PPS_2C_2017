import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable, AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth'

import { Profesor } from "../../clases/profesor";

@Injectable()
export class ProfesorServiceProvider {

  private listaMaterias:FirebaseListObservable<any[]>;
  private listaProfesores:FirebaseListObservable<any[]>;

  constructor(private db:AngularFireDatabase, private auth:AngularFireAuth) {

  }


  public traerListadoMaterias():FirebaseListObservable<any[]>{
    this.listaMaterias = this.db.list('materias') as FirebaseListObservable<any[]>;
    return this.listaMaterias;
  }

  public guardarProfesor(profesor:Profesor){
    profesor.setPerfil('profesor');
    this.db.app.database().ref('/profesores').child(profesor.getDNI()).set(profesor);
    this.db.app.database().ref('/usuarios').child(profesor.getDNI()).push(profesor);
    this.auth.auth.createUserWithEmailAndPassword(profesor.getCorreo(), profesor.getPassword());
  }


  public traerListadoMateriasPorProfesor(dni?:string, materia?:any):FirebaseListObservable<any[]>{
    this.listaMaterias = this.db.list('/profesores', {
      query:{
        orderByChild:'dni',
        equalTo:dni
      }
    }) as FirebaseListObservable<any[]>
    console.log('materias por profesor: ', this.listaMaterias);
    return this.listaMaterias;
  }


  public getMateriasProfesorPorCorreo(id:string){
    let lista:FirebaseListObservable<any[]>;
    let listaMaterias:any[];
    this.db.list('/profesores').subscribe(profesores=>{
      profesores.forEach(profesor => {
        console.log(profesor);
        if (profesor["dni"]==id) {
          listaMaterias = profesor["materias"];
          console.log(listaMaterias);
        }
      });
    });
    console.log(listaMaterias);
    return listaMaterias;
  }

 public getProfesoresLista(){
    this.listaProfesores = this.db.list('/profesores') as FirebaseListObservable<any[]>;
    return this.listaProfesores;
  }

  public borrarProfesor(dni:string){
    this.db.app.database().ref('/profesores/' + dni).remove();
  }

  public modificarProfesor(profesor:Profesor){
    this.db.app.database().ref('/profesores/' + profesor.getDNI()).update(profesor);
  }



}
