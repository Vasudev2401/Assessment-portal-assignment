import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Read data from db.json
const readData = () => {
  const data = fs.readFileSync('./db.json', 'utf8');
  return JSON.parse(data);
};

// Write data to db.json
const writeData = (data) => {
  fs.writeFileSync('./db.json', JSON.stringify(data, null, 2), 'utf8');
};

// Get all domains
app.get('/api/domains', (req, res) => {
  const data = readData();
  res.json(data.domains);
});

// Create a new domain
app.post('/api/domains', (req, res) => {
  const data = readData();
  const newDomain = {
    id: Date.now(),
    name: req.body.name,
    categories: []
  };
  
  data.domains.push(newDomain);
  writeData(data);
  
  res.status(201).json(newDomain);
});

// Update a domain
app.put('/api/domains/:id', (req, res) => {
  const data = readData();
  const domainId = parseInt(req.params.id);
  const domainIndex = data.domains.findIndex(domain => domain.id === domainId);
  
  if (domainIndex === -1) {
    return res.status(404).json({ error: 'Domain not found' });
  }
  
  data.domains[domainIndex].name = req.body.name;
  writeData(data);
  
  res.json(data.domains[domainIndex]);
});

// Delete a domain
app.delete('/api/domains/:id', (req, res) => {
  const data = readData();
  const domainId = parseInt(req.params.id);
  const domainIndex = data.domains.findIndex(domain => domain.id === domainId);
  
  if (domainIndex === -1) {
    return res.status(404).json({ error: 'Domain not found' });
  }
  
  data.domains.splice(domainIndex, 1);
  writeData(data);
  
  res.status(204).send();
});

// Create a new category
app.post('/api/domains/:domainId/categories', (req, res) => {
  const data = readData();
  const domainId = parseInt(req.params.domainId);
  const domainIndex = data.domains.findIndex(domain => domain.id === domainId);
  
  if (domainIndex === -1) {
    return res.status(404).json({ error: 'Domain not found' });
  }
  
  const newCategory = {
    id: Date.now(),
    name: req.body.name,
    questions: []
  };
  
  data.domains[domainIndex].categories.push(newCategory);
  writeData(data);
  
  res.status(201).json(newCategory);
});

// Update a category
app.put('/api/domains/:domainId/categories/:categoryId', (req, res) => {
  const data = readData();
  const domainId = parseInt(req.params.domainId);
  const categoryId = parseInt(req.params.categoryId);
  
  const domainIndex = data.domains.findIndex(domain => domain.id === domainId);
  if (domainIndex === -1) {
    return res.status(404).json({ error: 'Domain not found' });
  }
  
  const categoryIndex = data.domains[domainIndex].categories.findIndex(
    category => category.id === categoryId
  );
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  data.domains[domainIndex].categories[categoryIndex].name = req.body.name;
  writeData(data);
  
  res.json(data.domains[domainIndex].categories[categoryIndex]);
});

// Delete a category
app.delete('/api/domains/:domainId/categories/:categoryId', (req, res) => {
  const data = readData();
  const domainId = parseInt(req.params.domainId);
  const categoryId = parseInt(req.params.categoryId);
  
  const domainIndex = data.domains.findIndex(domain => domain.id === domainId);
  if (domainIndex === -1) {
    return res.status(404).json({ error: 'Domain not found' });
  }
  
  const categoryIndex = data.domains[domainIndex].categories.findIndex(
    category => category.id === categoryId
  );
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  data.domains[domainIndex].categories.splice(categoryIndex, 1);
  writeData(data);
  
  res.status(204).send();
});

// Create a new question
app.post('/api/domains/:domainId/categories/:categoryId/questions', (req, res) => {
  const data = readData();
  const domainId = parseInt(req.params.domainId);
  const categoryId = parseInt(req.params.categoryId);
  
  const domainIndex = data.domains.findIndex(domain => domain.id === domainId);
  if (domainIndex === -1) {
    return res.status(404).json({ error: 'Domain not found' });
  }
  
  const categoryIndex = data.domains[domainIndex].categories.findIndex(
    category => category.id === categoryId
  );
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  const newQuestion = {
    id: Date.now(),
    text: req.body.text,
    options: req.body.options
  };
  
  data.domains[domainIndex].categories[categoryIndex].questions.push(newQuestion);
  writeData(data);
  
  res.status(201).json(newQuestion);
});

// Update a question
app.put('/api/domains/:domainId/categories/:categoryId/questions/:questionId', (req, res) => {
  const data = readData();
  const domainId = parseInt(req.params.domainId);
  const categoryId = parseInt(req.params.categoryId);
  const questionId = parseInt(req.params.questionId);
  
  const domainIndex = data.domains.findIndex(domain => domain.id === domainId);
  if (domainIndex === -1) {
    return res.status(404).json({ error: 'Domain not found' });
  }
  
  const categoryIndex = data.domains[domainIndex].categories.findIndex(
    category => category.id === categoryId
  );
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  const questionIndex = data.domains[domainIndex].categories[categoryIndex].questions.findIndex(
    question => question.id === questionId
  );
  if (questionIndex === -1) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  data.domains[domainIndex].categories[categoryIndex].questions[questionIndex] = {
    ...data.domains[domainIndex].categories[categoryIndex].questions[questionIndex],
    text: req.body.text,
    options: req.body.options
  };
  
  writeData(data);
  
  res.json(data.domains[domainIndex].categories[categoryIndex].questions[questionIndex]);
});

// Delete a question
app.delete('/api/domains/:domainId/categories/:categoryId/questions/:questionId', (req, res) => {
  const data = readData();
  const domainId = parseInt(req.params.domainId);
  const categoryId = parseInt(req.params.categoryId);
  const questionId = parseInt(req.params.questionId);
  
  const domainIndex = data.domains.findIndex(domain => domain.id === domainId);
  if (domainIndex === -1) {
    return res.status(404).json({ error: 'Domain not found' });
  }
  
  const categoryIndex = data.domains[domainIndex].categories.findIndex(
    category => category.id === categoryId
  );
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  const questionIndex = data.domains[domainIndex].categories[categoryIndex].questions.findIndex(
    question => question.id === questionId
  );
  if (questionIndex === -1) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  data.domains[domainIndex].categories[categoryIndex].questions.splice(questionIndex, 1);
  writeData(data);
  
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});