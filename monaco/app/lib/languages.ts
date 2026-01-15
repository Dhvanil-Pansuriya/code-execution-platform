import { Language } from "../types/language";

export const LANGUAGES: Language[] = [
  {
    id: "javascript",
    name: "JavaScript",
    pistonRuntime: "javascript",
    version: "18.15.0",
    defaultCode: `// JavaScript Example
function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet("Developer");
console.log(message);
console.log("JavaScript is running on Piston API!");`,
  },
  {
    id: "typescript",
    name: "TypeScript",
    pistonRuntime: "typescript",
    version: "5.0.3",
    defaultCode: `// TypeScript Example
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const message: string = greet("Developer");
console.log(message);
console.log("TypeScript is running on Piston API!");`,
  },
  {
    id: "python",
    name: "Python",
    pistonRuntime: "python",
    version: "3.10.0",
    defaultCode: `# Python Example
def greet(name):
    return f"Hello, {name}!"

message = greet("Developer")
print(message)
print("Python is running on Piston API!")`,
  },
  {
    id: "java",
    name: "Java",
    pistonRuntime: "java",
    version: "15.0.2",
    defaultCode: `// Java Example
public class Main {
    public static void main(String[] args) {
        String message = greet("Developer");
        System.out.println(message);
        System.out.println("Java is running on Piston API!");
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
  },
  {
    id: "csharp",
    name: "C#",
    pistonRuntime: "csharp",
    version: "6.12.0",
    defaultCode: `// C# Example
using System;

class Program {
    static void Main() {
        string message = Greet("Developer");
        Console.WriteLine(message);
        Console.WriteLine("C# is running on Piston API!");
    }
    
    static string Greet(string name) {
        return $"Hello, {name}!";
    }
}`,
  },
  {
    id: "cpp",
    name: "C++",
    pistonRuntime: "cpp",
    version: "10.2.0",
    defaultCode: `// C++ Example
#include <iostream>
#include <string>

std::string greet(const std::string& name) {
    return "Hello, " + name + "!";
}

int main() {
    std::string message = greet("Developer");
    std::cout << message << std::endl;
    std::cout << "C++ is running on Piston API!" << std::endl;
    return 0;
}`,
  },
  {
    id: "c",
    name: "C",
    pistonRuntime: "c",
    version: "10.2.0",
    defaultCode: `// C Example
#include <stdio.h>

int main() {
    printf("Hello, Developer!\\n");
    printf("C is running on Piston API!\\n");
    return 0;
}`,
  },
  {
    id: "go",
    name: "Go",
    pistonRuntime: "go",
    version: "1.16.2",
    defaultCode: `// Go Example
package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

func main() {
    message := greet("Developer")
    fmt.Println(message)
    fmt.Println("Go is running on Piston API!")
}`,
  },
  {
    id: "rust",
    name: "Rust",
    pistonRuntime: "rust",
    version: "1.68.2",
    defaultCode: `// Rust Example
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    let message = greet("Developer");
    println!("{}", message);
    println!("Rust is running on Piston API!");
}`,
  },
  {
    id: "php",
    name: "PHP",
    pistonRuntime: "php",
    version: "8.2.3",
    defaultCode: `<?php
// PHP Example
function greet($name) {
    return "Hello, $name!";
}

$message = greet("Developer");
echo $message . "\\n";
echo "PHP is running on Piston API!\\n";
?>`,
  },
  {
    id: "ruby",
    name: "Ruby",
    pistonRuntime: "ruby",
    version: "3.0.1",
    defaultCode: `# Ruby Example
def greet(name)
  "Hello, #{name}!"
end

message = greet("Developer")
puts message
puts "Ruby is running on Piston API!"`,
  },
  {
    id: "swift",
    name: "Swift",
    pistonRuntime: "swift",
    version: "5.3.3",
    defaultCode: `// Swift Example
func greet(name: String) -> String {
    return "Hello, \\(name)!"
}

let message = greet(name: "Developer")
print(message)
print("Swift is running on Piston API!")`,
  },
  {
    id: "kotlin",
    name: "Kotlin",
    pistonRuntime: "kotlin",
    version: "1.8.20",
    defaultCode: `// Kotlin Example
fun greet(name: String): String {
    return "Hello, $name!"
}

fun main() {
    val message = greet("Developer")
    println(message)
    println("Kotlin is running on Piston API!")
}`,
  },
  {
    id: "r",
    name: "R",
    pistonRuntime: "r",
    version: "4.1.1",
    defaultCode: `# R Example
greet <- function(name) {
  paste("Hello,", name, "!")
}

message <- greet("Developer")
print(message)
print("R is running on Piston API!")`,
  },
  {
    id: "perl",
    name: "Perl",
    pistonRuntime: "perl",
    version: "5.36.0",
    defaultCode: `# Perl Example
sub greet {
    my $name = shift;
    return "Hello, $name!";
}

my $message = greet("Developer");
print "$message\\n";
print "Perl is running on Piston API!\\n";`,
  },
  {
    id: "scala",
    name: "Scala",
    pistonRuntime: "scala",
    version: "3.2.2",
    defaultCode: `// Scala Example
object Main {
  def greet(name: String): String = {
    s"Hello, $name!"
  }

  def main(args: Array[String]): Unit = {
    val message = greet("Developer")
    println(message)
    println("Scala is running on Piston API!")
  }
}`,
  },
  {
    id: "bash",
    name: "Bash",
    pistonRuntime: "bash",
    version: "5.2.0",
    defaultCode: `#!/bin/bash
# Bash Example

greet() {
    echo "Hello, $1!"
}

message=$(greet "Developer")
echo "$message"
echo "Bash is running on Piston API!"`,
  },
  {
    id: "lua",
    name: "Lua",
    pistonRuntime: "lua",
    version: "5.4.4",
    defaultCode: `-- Lua Example
function greet(name)
    return "Hello, " .. name .. "!"
end

local message = greet("Developer")
print(message)
print("Lua is running on Piston API!")`,
  },
  {
    id: "haskell",
    name: "Haskell",
    pistonRuntime: "haskell",
    version: "9.0.1",
    defaultCode: `-- Haskell Example
greet :: String -> String
greet name = "Hello, " ++ name ++ "!"

main :: IO ()
main = do
    let message = greet "Developer"
    putStrLn message
    putStrLn "Haskell is running on Piston API!"`,
  },
  {
    id: "elixir",
    name: "Elixir",
    pistonRuntime: "elixir",
    version: "1.13.4",
    defaultCode: `# Elixir Example
defmodule Hello do
  def greet(name) do
    "Hello, #{name}!"
  end
end

message = Hello.greet("Developer")
IO.puts(message)
IO.puts("Elixir is running on Piston API!")`,
  },
  {
    id: "clojure",
    name: "Clojure",
    pistonRuntime: "clojure",
    version: "1.10.3",
    defaultCode: `; Clojure Example
(defn greet [name]
  (str "Hello, " name "!"))

(def message (greet "Developer"))
(println message)
(println "Clojure is running on Piston API!")`,
  },
  {
    id: "dart",
    name: "Dart",
    pistonRuntime: "dart",
    version: "2.19.6",
    defaultCode: `// Dart Example
String greet(String name) {
  return 'Hello, $name!';
}

void main() {
  var message = greet('Developer');
  print(message);
  print('Dart is running on Piston API!');
}`,
  },
  {
    id: "fsharp",
    name: "F#",
    pistonRuntime: "fsharp",
    version: "7.0.203",
    defaultCode: `// F# Example
let greet name =
    sprintf "Hello, %s!" name

let message = greet "Developer"
printfn "%s" message
printfn "F# is running on Piston API!"`,
  },
  {
    id: "groovy",
    name: "Groovy",
    pistonRuntime: "groovy",
    version: "4.0.0",
    defaultCode: `// Groovy Example
def greet(name) {
    return "Hello, $name!"
}

def message = greet("Developer")
println message
println "Groovy is running on Piston API!"`,
  },
  {
    id: "julia",
    name: "Julia",
    pistonRuntime: "julia",
    version: "1.8.5",
    defaultCode: `# Julia Example
function greet(name)
    return "Hello, $name!"
end

message = greet("Developer")
println(message)
println("Julia is running on Piston API!")`,
  },
  {
    id: "ocaml",
    name: "OCaml",
    pistonRuntime: "ocaml",
    version: "4.12.0",
    defaultCode: `(* OCaml Example *)
let greet name =
  "Hello, " ^ name ^ "!"

let () =
  let message = greet "Developer" in
  print_endline message;
  print_endline "OCaml is running on Piston API!"`,
  },
  {
    id: "pascal",
    name: "Pascal",
    pistonRuntime: "pascal",
    version: "3.2.2",
    defaultCode: `// Pascal Example
program Hello;

function Greet(name: string): string;
begin
  Greet := 'Hello, ' + name + '!';
end;

var
  message: string;

begin
  message := Greet('Developer');
  WriteLn(message);
  WriteLn('Pascal is running on Piston API!');
end.`,
  },
  {
    id: "prolog",
    name: "Prolog",
    pistonRuntime: "prolog",
    version: "8.4.2",
    defaultCode: `% Prolog Example
greet(Name, Message) :-
    atom_concat('Hello, ', Name, Temp),
    atom_concat(Temp, '!', Message).

:- initialization(main).
main :-
    greet('Developer', Message),
    writeln(Message),
    writeln('Prolog is running on Piston API!'),
    halt.`,
  },
  {
    id: "racket",
    name: "Racket",
    pistonRuntime: "racket",
    version: "8.3.0",
    defaultCode: `#lang racket
; Racket Example

(define (greet name)
  (string-append "Hello, " name "!"))

(define message (greet "Developer"))
(displayln message)
(displayln "Racket is running on Piston API!")`,
  },
  {
    id: "sql",
    name: "SQL (SQLite)",
    pistonRuntime: "sqlite3",
    version: "3.36.0",
    defaultCode: `-- SQL Example
SELECT 'Hello, Developer!' as message;
SELECT 'SQL is running on Piston API!' as info;`,
  },
];
