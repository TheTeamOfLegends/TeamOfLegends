import { useNavigate, useRouteError } from 'react-router-dom'
import { useEffect } from 'react'
import styled from 'styled-components'

const RouteErrorWrapper = styled.div`
  --gap: 12px;

  position: fixed;
  inset: 0;
  background-color: #282828;

  .route-error {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    display: grid;
    grid-template-columns: 1fr;
    row-gap: var(--gap);
    color: #fff;

    .route-error-navigation {
      display: flex;
      gap: var(--gap);
    }
  }

  button {
    border: 1px solid white;
    outline: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 4px 8px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #cbcbcb;
    }
  }
`

export const RouteError = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  useEffect(() => {
    console.error('В приложении произошла ошибка:', error)
  }, [])

  return (
    <RouteErrorWrapper>
      <div className="route-error">
        <div>Что-то пошло не так</div>
        <div className="route-error-navigation">
          <button type="button" onClick={() => window.location.reload()}>
            Обновить
          </button>
          <button
            type="button"
            onClick={() => navigate('/', { replace: true })}>
            На главную
          </button>
        </div>
      </div>
    </RouteErrorWrapper>
  )
}
