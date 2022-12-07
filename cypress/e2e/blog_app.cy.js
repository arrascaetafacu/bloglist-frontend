describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request(
      'POST',
      'http://localhost:3003/api/users',
      { username: 'facuarrascaeta', password: 'test', name: 'facu' }
    )
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function() {
    cy.get('form')
      .contains('Login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('facuarrascaeta')
      cy.get('#password').type('test')
      cy.contains('Login').click()

      cy.contains('facu logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('facuarrascaeta')
      cy.get('#password').type('wrong')
      cy.contains('Login').click()

      cy.get('html').should('not.contain', 'facu logged-in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.request(
        'POST',
        'http://localhost:3003/api/login',
        { username: 'facuarrascaeta', password: 'test' }
      )
        .then(response => {
          localStorage.setItem('loggedUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('input[name="title"]').type('React patterns')
      cy.get('input[name="author"]').type('Michael Chan')
      cy.get('input[name="url"]').type('https://reactpatterns.com/')
      cy.get('#createblog-btn').click()

      cy.contains('React patterns Michael Chan')
    })

    describe('and a blogs exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'React patterns',
          author: 'Michael Chan',
          url: 'https://reactpatterns.com/',
        })

        cy.visit('http://localhost:3000')
      })

      it('it can be liked', function() {
        cy.contains('React patterns Michael Chan')
          .parent()
          .contains('view')
          .click()
        cy.get('.blog-details')
          .contains('like')
          .click()

        cy.get('.blog-details')
          .contains('likes: 1')
      })

      it('it can be delated', function() {
        cy.contains('React patterns Michael Chan')
          .parent().contains('view').click()

        cy.get('.blog-details')
          .get('#remove-btn')
          .click()

        cy.get('html').should('not.contain', 'React patterns Michael Chan')
      })
    })

    describe('and several blogs exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'The title with the second most likes', author: 'test', url: 'test', likes: 1 })
        cy.createBlog({ title: 'The title with the most likes', author: 'test', url: 'test', likes: 2 })
        cy.visit('http://localhost:3000')
      })

      it.only('are ordered by most likes', function() {
        cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')

        cy.get('.blog').eq(1).contains('view').click()
        cy.get('.blog').eq(1).contains('like').click()
        cy.get('.blog').eq(0).contains('like').click()
        cy.get('.blog').eq(0).contains('The title with the second most likes test')

      })

    })

  })
})