// ─────────────────────────────────────────────────────────
// sharepoint.js  —  SharePoint REST API utility
// Place this file at: src/utils/sharepoint.js
// ─────────────────────────────────────────────────────────

/**
 * Fetch all items from a SharePoint list
 * @param {string} siteUrl   - e.g. "https://company.sharepoint.com/teams/MonitoringTeam"
 * @param {string} listName  - exact list display name
 * @param {object} options   - { select, filter, orderby, top }
 * @returns {Array}          - array of list item objects
 */
export async function getListItems(siteUrl, listName, options = {}) {
  const {
    select  = '',
    filter  = '',
    orderby = '',
    top     = 5000,
  } = options

  // Build SharePoint REST API URL
  let url = `${siteUrl}/_api/lists/getbytitle('${encodeURIComponent(listName)}')/items?$top=${top}`
  if (select)  url += `&$select=${select}`
  if (filter)  url += `&$filter=${filter}`
  if (orderby) url += `&$orderby=${orderby}`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',          // uses existing Microsoft browser session
    headers: {
      'Accept':       'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose',
    },
  })

  if (!res.ok) {
    throw new Error(`SharePoint fetch failed [${res.status}]: ${listName}`)
  }

  const json = await res.json()
  return json?.d?.results ?? []
}


/**
 * Get form digest value — required before any POST/write to SharePoint
 */
async function getDigest(siteUrl) {
  const res = await fetch(`${siteUrl}/_api/contextinfo`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Accept': 'application/json;odata=verbose' },
  })
  const json = await res.json()
  return json?.d?.GetContextWebInformation?.FormDigestValue
}


/**
 * Add a new item to a SharePoint list
 * @param {string} siteUrl   - SharePoint site URL
 * @param {string} listName  - list display name
 * @param {object} fields    - key/value pairs to save
 * @returns {object}         - the created item
 */
export async function addListItem(siteUrl, listName, fields) {
  const digest = await getDigest(siteUrl)

  // Get the list entity type name (needed for SharePoint REST API)
  const metaRes = await fetch(
    `${siteUrl}/_api/lists/getbytitle('${encodeURIComponent(listName)}')` +
    `?$select=ListItemEntityTypeFullName`,
    {
      credentials: 'include',
      headers: { 'Accept': 'application/json;odata=verbose' },
    }
  )
  const metaJson = await metaRes.json()
  const entityType = metaJson?.d?.ListItemEntityTypeFullName

  const body = {
    __metadata: { type: entityType },
    ...fields,
  }

  const url = `${siteUrl}/_api/lists/getbytitle('${encodeURIComponent(listName)}')/items`

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept':         'application/json;odata=verbose',
      'Content-Type':   'application/json;odata=verbose',
      'X-RequestDigest': digest,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`SharePoint POST failed [${res.status}]: ${err}`)
  }

  return await res.json()
}


/**
 * Update an existing item in a SharePoint list
 * @param {string} siteUrl   - SharePoint site URL
 * @param {string} listName  - list display name
 * @param {number} itemId    - the ID of the item to update
 * @param {object} fields    - fields to update
 */
export async function updateListItem(siteUrl, listName, itemId, fields) {
  const digest = await getDigest(siteUrl)

  const metaRes = await fetch(
    `${siteUrl}/_api/lists/getbytitle('${encodeURIComponent(listName)}')` +
    `?$select=ListItemEntityTypeFullName`,
    {
      credentials: 'include',
      headers: { 'Accept': 'application/json;odata=verbose' },
    }
  )
  const metaJson = await metaRes.json()
  const entityType = metaJson?.d?.ListItemEntityTypeFullName

  const body = {
    __metadata: { type: entityType },
    ...fields,
  }

  const url = `${siteUrl}/_api/lists/getbytitle('${encodeURIComponent(listName)}')/items(${itemId})`

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept':              'application/json;odata=verbose',
      'Content-Type':        'application/json;odata=verbose',
      'X-RequestDigest':     digest,
      'X-HTTP-Method':       'MERGE',
      'If-Match':            '*',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`SharePoint UPDATE failed [${res.status}]`)
  }

  return true
}


/**
 * Get items from a SharePoint document library (for SOP screen)
 * @param {string} siteUrl      - SharePoint site URL
 * @param {string} libraryName  - document library name
 * @returns {Array}             - array of file objects with name, url, etc.
 */
export async function getLibraryFiles(siteUrl, libraryName) {
  const url =
    `${siteUrl}/_api/lists/getbytitle('${encodeURIComponent(libraryName)}')/items` +
    `?$select=FileLeafRef,FileRef,Title,Modified,File/Length` +
    `&$expand=File&$top=500`

  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Accept': 'application/json;odata=verbose' },
  })

  if (!res.ok) throw new Error(`Library fetch failed [${res.status}]`)
  const json = await res.json()
  return json?.d?.results ?? []
}
