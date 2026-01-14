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
];
