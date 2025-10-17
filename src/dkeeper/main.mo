import List "mo:base/List";
import Debug "mo:base/Debug"


actor DKeeper {



  public type Note = {  //this is an object
    title: Text;
    content: Text;
  };


//this is for reload page and still keep the data display on frontend but not for redeploy, add "stable is for redeploy, 
  var notes: List.List<Note> = List.nil<Note>(); //CREATE an array of Note object

// ****** CRUD 

  public func createNote(titleText: Text, contentText:Text){     
    let newNote: Note = {
      title = titleText;
      content = contentText;
    };
    //UPDATE
    notes := List.push(newNote, notes); //psuh newNote into var notes above, := means update new state of the const ?not sure why 
    Debug.print(debug_show(notes));
    //DELETE
    
  };

  //READ
  //The front end needs to get hold of this when the page loads 
  //Use query for when not udating the state/just show the existing output, query for faster runtime
  public query func readNotes(): async [Note] {
    return List.toArray(notes); //its in a motoko weird-list structure so has to convert it back into array

  };


  public func removeNote(id: Nat){
    //take drop append

    
    let listFront = List.take(notes, id); //(array, index)//take first 2 elements → [D, C]
    let listBack = List.drop(notes, id + 1);// drop first 3 elements (0,1,2) → leaves [A]
    notes := List.append(listFront, listBack);//[D, C] ++ [A] = [D, C, A]

  };




   
}

// //Creating canister,the Motoko file is your
//  backend smart contract (aka a canister) that runs on the 
//  Internet Computer (IC). The React code is just the UI. 
//  Motoko is where the data lives and the logic happens.
/*
1--- What the Motoko canister does

Defines your data model (e.g., a Note with id, title, content, created).

Exposes public functions you can call from JS, like createNote, getNotes, deleteNote.

Stores state in stable variables, so your notes survive rebuilds/upgrades.

2 ---How the frontend talks to it

When you run/build, dfx compiles Motoko → WebAssembly → deploys it → generates Candid bindings under src/declarations/<canister_name>/.

Your React code imports those bindings and just calls methods like normal async JS:

3----Query vs Update (important for UX)

query functions are read-only and fast (sub-second), but can’t modify state. Great for getNotes().

update functions change state (create/delete) and go through consensus, so they’re slower (usually 1–2s) and return after the change is finalized.

4---Where it lives in your project

Backend canister (Motoko) is usually in src/dkeeper_backend/main.mo (or similar).

Frontend assets canister is src/dkeeper_assets/… (your React app).

dfx.json ties them together and names the canisters.

5---Dev loop you’ll use

Start local replica: dfx start --background

Deploy/update: dfx deploy (builds Motoko, deploys, generates src/declarations/...)

Run UI: npm start (Webpack serves React, which calls your canister via those declarations)
*/