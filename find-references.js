const fs = require("fs")
const path = require("path")

function searchFiles(dir, searchString) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      searchFiles(filePath, searchString)
    } else if (stats.isFile() && (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js"))) {
      const content = fs.readFileSync(filePath, "utf8")
      if (content.includes(searchString)) {
        console.log(`Found in ${filePath}`)
      }
    }
  }
}

// Search for the problematic import
searchFiles(".", "@/lib/supabase/supabaseBrowserClient")
