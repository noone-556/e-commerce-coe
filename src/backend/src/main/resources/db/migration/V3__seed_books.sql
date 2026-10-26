INSERT INTO categories (name, slug, description) VALUES
    ('Comedy',  'comedy',  'Books that make you laugh out loud'),
    ('Horror',  'horror',  'Spine-chilling stories for brave readers'),
    ('Fiction', 'fiction', 'Timeless stories and unforgettable characters'),
    ('History', 'history', 'True stories that shaped our world'),
    ('Kids',    'kids',    'Fun and colourful reads for young readers');

INSERT INTO products (category_id, title, author, description, price, stock_quantity, image_url)
SELECT c.id, v.title, v.author, v.description, v.price, v.stock, v.image_url
FROM (VALUES
    -- Comedy
    ('comedy', 'Good Omens', 'Terry Pratchett & Neil Gaiman', 'An angel and a demon team up to stop the end of the world, because they rather like it here.', 45.90, 20, '/images/books/good-omens.jpg'),
    ('comedy', 'The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 'Seconds before Earth is demolished, Arthur Dent is whisked off on a wildly absurd trip across space.', 39.90, 25, '/images/books/hitchhikers-guide.jpg'),
    ('comedy', 'Three Men in a Boat', 'Jerome K. Jerome', 'Three friends and a dog take a boating holiday on the Thames, and almost nothing goes to plan.', 24.90, 12, '/images/books/three-men-in-a-boat.jpg'),
    ('comedy', 'Bridget Jones''s Diary', 'Helen Fielding', 'A year in the life of a single woman in London, told through a hilariously honest diary.', 42.00, 15, '/images/books/bridget-jones.jpg'),
    ('comedy', 'Catch-22', 'Joseph Heller', 'A WWII bomber pilot tries every trick to get out of flying missions in this sharp satire of war.', 49.90, 10, '/images/books/catch-22.jpg'),
    -- Horror
    ('horror', 'Dracula', 'Bram Stoker', 'Told through letters and diaries, a group of friends hunt the legendary count from Transylvania.', 29.90, 18, '/images/books/dracula.jpg'),
    ('horror', 'Frankenstein', 'Mary Shelley', 'A young scientist brings a creature to life and must face the terrible results.', 27.90, 22, '/images/books/frankenstein.jpg'),
    ('horror', 'The Shining', 'Stephen King', 'A family looks after an empty mountain hotel for the winter, but the hotel has other plans.', 52.90, 14, '/images/books/the-shining.jpg'),
    ('horror', 'The Haunting of Hill House', 'Shirley Jackson', 'Four strangers stay in a house with a dark past to study its strange events.', 44.90, 9, '/images/books/hill-house.jpg'),
    ('horror', 'Mexican Gothic', 'Silvia Moreno-Garcia', 'A young woman visits a decaying mansion in 1950s Mexico and uncovers its family secrets.', 55.00, 11, '/images/books/mexican-gothic.jpg'),
    -- Fiction
    ('fiction', 'To Kill a Mockingbird', 'Harper Lee', 'Seen through a child''s eyes, a lawyer defends an innocent man in a divided Southern town.', 39.90, 30, '/images/books/mockingbird.jpg'),
    ('fiction', '1984', 'George Orwell', 'In a world where Big Brother watches everyone, one man dares to think for himself.', 34.90, 28, '/images/books/1984.jpg'),
    ('fiction', 'The Great Gatsby', 'F. Scott Fitzgerald', 'A mysterious millionaire throws lavish parties hoping to win back a lost love.', 29.90, 19, '/images/books/great-gatsby.jpg'),
    ('fiction', 'Pride and Prejudice', 'Jane Austen', 'Witty Elizabeth Bennet and proud Mr Darcy learn that first impressions can be wrong.', 25.90, 24, '/images/books/pride-and-prejudice.jpg'),
    ('fiction', 'The Alchemist', 'Paulo Coelho', 'A shepherd boy follows his dream across the desert in search of treasure.', 38.00, 35, '/images/books/the-alchemist.jpg'),
    -- History
    ('history', 'Sapiens', 'Yuval Noah Harari', 'A brief history of humankind, from the first humans to the modern world.', 59.90, 21, '/images/books/sapiens.jpg'),
    ('history', 'Guns, Germs, and Steel', 'Jared Diamond', 'Why did some societies conquer others? Geography may hold the answer.', 54.90, 8, '/images/books/guns-germs-steel.jpg'),
    ('history', 'The Diary of a Young Girl', 'Anne Frank', 'The real diary of a Jewish girl hiding with her family during World War II.', 32.90, 17, '/images/books/anne-frank.jpg'),
    ('history', 'SPQR', 'Mary Beard', 'A lively history of ancient Rome, from its legends to its mighty empire.', 62.00, 6, '/images/books/spqr.jpg'),
    ('history', 'The Silk Roads', 'Peter Frankopan', 'The story of the trade routes linking East and West that shaped world history.', 58.90, 7, '/images/books/silk-roads.jpg'),
    -- Kids
    ('kids', 'Charlotte''s Web', 'E. B. White', 'A clever spider and a kind pig form a friendship that saves a life.', 22.90, 26, '/images/books/charlottes-web.jpg'),
    ('kids', 'Matilda', 'Roald Dahl', 'A brilliant little girl with special powers stands up to the grown-ups who treat her badly.', 26.90, 30, '/images/books/matilda.jpg'),
    ('kids', 'The Gruffalo', 'Julia Donaldson', 'A clever mouse outsmarts the hungry animals of the deep dark wood.', 19.90, 40, '/images/books/the-gruffalo.jpg'),
    ('kids', 'Where the Wild Things Are', 'Maurice Sendak', 'Max sails away to an island of wild things and becomes their king.', 21.90, 23, '/images/books/wild-things.jpg'),
    ('kids', 'The Very Hungry Caterpillar', 'Eric Carle', 'Follow a tiny caterpillar as it eats its way through the week.', 18.90, 45, '/images/books/hungry-caterpillar.jpg')
) AS v (slug, title, author, description, price, stock, image_url)
JOIN categories c ON c.slug = v.slug;